## word2vec简介

Word2Vec是一种用于生成词向量的技术，它可以将单词映射到向量空间中的位置，使得相似的单词在向量空间中的距离也相似。Word2Vec模型由Google在2013年发布，它是一种基于神经网络的模型，可以通过大量的文本数据来训练。

Word2Vec模型有两种不同的架构：连续词袋模型（CBOW）和Skip-gram模型。CBOW模型尝试根据上下文单词的平均值来预测当前单词，而Skip-gram模型则尝试根据当前单词来预测上下文单词。

在训练Word2Vec模型时，我们首先需要将文本数据转换为单词序列。然后，我们可以使用这些单词序列来训练模型，生成每个单词的向量表示。这些向量可以用于计算单词之间的相似度，或用于其他自然语言处理任务，如文本分类和情感分析。

Word2Vec模型的优点是它可以生成高质量的单词向量，这些向量可以用于多种自然语言处理任务。它还可以使用大量的文本数据进行训练，从而提高模型的准确性。

## word2vec的定义

```python
class Word2Vec(utils.SaveLoad):
    def __init__(
            self, sentences=None, corpus_file=None, vector_size=100, alpha=0.025, window=5, min_count=5,
            max_vocab_size=None, sample=1e-3, seed=1, workers=3, min_alpha=0.0001,
            sg=0, hs=0, negative=5, ns_exponent=0.75, cbow_mean=1, hashfxn=hash, epochs=5, null_word=0,
            trim_rule=None, sorted_vocab=1, batch_words=MAX_WORDS_IN_BATCH, compute_loss=False, callbacks=(),
            comment=None, max_final_vocab=None, shrink_windows=True,
        ):
```

以下是每个参数的解释：

- `sentences`：此参数接受句子列表作为输入。每个句子是一个单词列表，整个语料库是这些句子的列表。或者，您可以提供包含语料库的文件的文件名。
- `corpus_file`：语料库文件的文件名，如果您不直接提供句子。
- `vector_size`：词向量的维度。
- `alpha`：训练模型的初始学习率。
- `window`：句子中当前单词和预测单词之间的最大距离。
- `min_count`：语料库中包含单词的最小频率，才会包含在词汇表中。
- `max_vocab_size`：词汇表的最大大小。如果语料库中有更多的唯一单词，则将删除最不常见的单词。
- `sample`：用于配置哪些高频词随机降采样的阈值。
- `seed`：用于初始化内部权重的随机种子。
- `workers`：训练模型时要使用的线程数。
- `min_alpha`：训练模型的最小学习率。
- `sg`：训练算法。如果`sg = 0`，则使用CBOW（连续的词袋模型）。如果`sg = 1`，则使用Skip-Gram算法。
- `hs`：如果`hs = 1`，则将使用分层softmax进行模型训练。如果`hs = 0`且`negative> 0`，则将使用负采样。
- `negative`：用于负采样的负样本数量。如果`negative = 0`，则不使用负采样。
- `ns_exponent`：用于形状化负采样分布的指数。
- `cbow_mean`：如果`cbow_mean = 1`，则使用上下文单词向量的平均值进行预测。如果`cbow_mean = 0`，则使用上下文单词向量的总和。
- `hashfxn`：用于随机初始化权重的哈希函数。
- `epochs`：在训练期间对语料库进行的迭代次数。
- `null_word`：空单词的索引。如果设置为0，则不使用空单词。
- `trim_rule`：可用于修剪词汇表的函数。如果设置为None，则不进行修剪。
- `sorted_vocab`：如果`sorted_vocab = 1`，则在修剪之前按降序频率对词汇表进行排序。
- `batch_words`：每个训练数据批次中的单词数。
- `compute_loss`：如果`compute_loss = True`，则在训练期间将计算损失。
- `callbacks`：要在训练期间执行的回调函数列表。
- `comment`: 一个要添加到模型中的注释。 
- `max_final_vocab`: 最终词汇表的最大大小。如果设置为None，则将使用整个词汇表。 
- `shrink_windows`: 如果shrink_windows=True，则对于靠近句子开头和结尾的单词，窗口大小将被缩小。

## 训练模型

在训练模型之前，要对收集的预料进行分词处理，同时也要进行停用词的处理。在对数据进行预处理之后就可以训练我们的词向量了。训练的方式，从代码实现角度看，有两种，如下：

```python
from gensim.models import KeyedVectors,word2vec,Word2Vec
import jieba
import multiprocessing
 
def stopwordslist():
    stopwords = [ line.strip() for line in open('stopwords.txt','r',encoding='utf-8').readlines()]
    return stopwords
 
if __name__ == '__main__':
    sentences_list = [
        '详细了解园区规划，走访入驻企业项目，现场察看产品研发和产业化情况。他强调，',
        '要坚持规划先行，立足高起点、高标准、高质量，科学规划园区组团，提升公共服务水平，',
        '注重产城融合发展。要增强集聚功能，集聚产业、人才、技术、资本，加快构建从基础研究、',
        '技术研发、临床实验到药品生产的完整产业链条，完善支撑产业发展的研发孵化、成果转化、',
        '生产制造平台等功能配套，推动产学研用协同创新，做大做强生物医药产业集群。唐良智在调研',
        '中指出，我市生物医药产业具有良好基础，但与高质量发展的要求相比，在规模、结构、创新能力',
        '等方面还存在不足。推动生物医药产业高质量发展，努力培育新兴支柱产业，必须紧紧依靠创新创业',
        '创造，着力营造良好发展环境。要向改革开放要动力，纵深推进“放管服”改革，用好国际国内创新资源，',
        '大力引进科技领军人才、高水平创新团队。要坚持问题导向，聚焦企业面临的困难和问题，把握生物医药产业',
        '发展特点，精准谋划、不断完善产业支持政策，切实增强企业获得感。要精准服务企业，构建亲清新型政商关系，',
        '以高效优质服务助力企业发展',
        '2018年我省软件和信息服务业发展指数为67.09，']
    #加载停用词表
    stopwords = stopwordslist()
    sentences_cut = []
    #结巴分词
    for ele in sentences_list:
        cuts = jieba.cut(ele, cut_all=False)
        new_cuts = []
        for cut in cuts:
            if cut not in stopwords:
                new_cuts.append(cut)
        sentences_cut.append(new_cuts)

    #将分词后的文本保存到data.txt文件中
    with open('data.txt', 'w', encoding='utf-8') as f:
        for ele in sentences_cut:
            ele_str = ' '.join(ele) + '\n'
            f.write(ele_str)

 
    #可以用BrownCorpus,Text8Corpus或lineSentence来构建sentences，一般大语料使用这个
 
    sentences = list(word2vec.LineSentence('data.txt'))
    # sentences = list(word2vec.Text8Corpus('data.txt'))
 
    # 小语料可以不使用
    # sentences = sentences_cut
    print(sentences)
 
    #训练方式1
    model = Word2Vec(sentences,vector_size = 256, min_count=1, window=5,sg=0,workers=multiprocessing.cpu_count())
    print(model)
 
    #训练方式2
    #加载一个空模型
    model2 = Word2Vec(vector_size=256,min_count=1)
    # 加载词表
    model2.build_vocab(sentences)
    # 训练
    model2.train(sentences, total_examples=model2.corpus_count, epochs=10)
    print(model2)
```

## 模型保存和加载

模型保存可以有很多种格式，根据格式的不同可以分为2种，一种是保存为.model的文件，一种是非.model文件的保存。常用的保存格式是.model和.vector直接上代码和结果：

```python
     # 方式一
    model.save('word2vec.model')
 
    # 方式二
    model2.wv.save_word2vec_format('word2vec.vector')
    model2.wv.save_word2vec_format('word2vec.bin')
```

注意使用的API不同，一个是`model.save()` 一个是 `model.wv.save_word2vec_format()`。结果如图：`.vector`和`.bin文件`直接可以用txt打开可视，它们的内存占用要少一些，加载的时间要多一点。

模型加载，对比如下：

```python
    #加载方式1
    t1 = time.time()
    model = Word2Vec.load('word2vec.model')
    t2 = time.time()
    print(model)
    print(".molde load time %.4f"%(t2-t1))
 
    #加载方式2
    t1 = time.time()
    model = KeyedVectors.load_word2vec_format('word2vec.vector')
    t2 = time.time()
    print(len(model.vectors))
    print(".vector load time %.4f" % (t2 - t1))
```

运行结果：

```bash
    .molde load time 0.0065
    137
    .vector load time 0.0243
```

这两种方式的加载在获取词向量的时候应该是差别不大，区别就是.model可以继续训练，.vector的文件不能继续训练。加载速度也可以见，前者比后者快很多。前者时间为0.0020秒后者0.03秒，相差十多倍。

## 模型的增量训练

模型训练以后，模型中用到的词已经确定下来了，一般都会存在这样的场景，模型训练以后，会有新的语料，也就存在新词，这个时候新词用word2vec就得不到词向量，会报ovo(貌似这样的，反正就是out vacbuary)的错误。那么就需要重新训练模型，gensim就提供了一个很好的机制，就是增量训练，新词不用和旧词全部一起训练。

```python
    model = Word2Vec.load('word2vec.model')
    print(model)
    new_sentence = [
        '国考28日网上查报名序号查询后务必牢记报名参加2011年国家公务员的考生，如果您已通过资格审查，那么请于10月28日8：00后，登录考录专题网站查询自己的“关键数字”——报名序号。国家公务员局等部门提醒：报名序号是报考人员报名确认和下载打印准考证等事项的重要依据和关键字，请务必牢记。此外，由于年龄在35周岁以上、40周岁以下的应届毕业硕士研究生和博士研究生(非在职)，不通过网络进行报名，所以，这类人报名须直接与要报考的招录机关联系，通过电话传真或发送电子邮件等方式报名。',
        '甲醇期货今日挂牌上市继上半年焦炭、铅期货上市后，酝酿已久的甲醇期货将在今日正式挂牌交易。基准价均为3050元／吨继上半年焦炭、铅期货上市后，酝酿已久的甲醇期货将在今日正式挂牌交易。郑州商品交易所（郑商所）昨日公布首批甲醇期货8合约的上市挂牌基准价，均为3050元／吨。据此推算，买卖一手甲醇合约至少需要12200元。业内人士认为，作为国际市场上的首个甲醇期货品种，其今日挂牌后可能会因炒新资金追捧而出现冲高走势，脉冲式行情过后可能有所回落，不过，投资者在上市初期应关注期现价差异常带来的无风险套利交易机会。',
        '人工智能包含机器视觉和自然语言处理'
    ]
    stopwords = stopwordslist()
    sentences_cut = []
    #结巴分词
    for ele in new_sentence:
        cuts = jieba.cut(ele,cut_all=False)
        new_cuts = []
        for cut in cuts:
            if cut not in  stopwords:
                new_cuts.append(cut)
        sentences_cut.append(new_cuts)
    #增量训练word2vec
    model.build_vocab(sentences_cut,update=True) #注意update = True 这个参数很重要
    model.train(sentences_cut,total_examples=model.corpus_count,epochs=10)
    print(model)
```

输出:

```bash
Word2Vec<vocab=137, vector_size=256, alpha=0.025>
Word2Vec<vocab=274, vector_size=256, alpha=0.025>
```

`model.build_vocab(sentences_cut,update=True)`新增词汇训练模型，得到新的模型。

## 模型常用API

现在要获取词向量，直接使用

```python
vec = model['生物医药']
print(vec)
```

一般都是使用word2vec来计算文本相似度，这里介绍几个常用的文本相似度的API

```python
#Compute the Word Mover's Distance between two documents.
#计算两个文档的相似度——词移距离算法
model.wv.wmdistance()
 
# Compute cosine similarity between two sets of words.
# 计算两列单词之间的余弦相似度——也可以用来评估文本之间的相似度
model.wv.n_similarity(ws1, ws2)
 
#Compute cosine similarities between one vector and a set of other vectors.
#计算向量之间的余弦相似度
model.wv.cosine_similarities(vector_1, vectors_all)
 
#Compute cosine similarity between two words.
#计算2个词之间的余弦相似度
model.wv.similarity(w1, w2)
 
#Find the top-N most similar words.
# 找出前N个最相似的词
model.wv.most_similar(positive=None, negative=None, topn=10, restrict_vocab=None, indexer=None)
```

## 文本相似度计算——文档级别

文本相似度的计算可以分为词、句子、段落和全文这几个层次，全文级别的也就是文档级别的。文档级别的相似任务，作为一个新入坑的小白，很容易就想到这样一条思路：对文档提取关键词，然后计算关键词之间的词移距离。这里面涉及到分词、关键词提取、关键词个数的选择等技术细节，最后还涉及到词移距离的计算，关键词的权重(重要程度)是否带入计算中。这里不考虑很多技术细节，仅仅把提取好的关键词做一个词移距离计算，展示一下`gensim.model.word2vecmodelAPI`的使用。

```python
model.wv.n_similarity(ws1,ws2)
```

数据如下：

```python
sent1 = ['奇瑞', '新能源', '运营', '航天', '新能源汽车', '平台', '城市', '打造', '技术', '携手']
sent2 = ['新能源', '奇瑞', '新能源汽车', '致力于', '支柱产业', '整车', '汽车', '打造', '产业化', '产业基地']
sent3 = ['辉瑞', '阿里', '互联网', '医师', '培训', '公益', '制药', '项目', '落地', '健康']
sent4 = ['互联网', '医院', '落地', '阿里', '健康', '就医', '流程', '在线', '支付宝', '加速']
```

计算sent1和其他的相似度：

```python
    t1 = time.time()
    model = Word2Vec.load('../model/word2vec.model')
    model.init_sims(replace=True)
    t2 = time.time()
    print(model)
    print('加载时间：%.4f' % (t2 - t1))
 
    sent1 = ['奇瑞', '新能源', '运营', '航天', '新能源汽车', '平台', '城市', '打造', '技术', '携手']
    sent2 = ['新能源', '奇瑞', '新能源汽车', '致力于', '支柱产业', '整车', '汽车', '打造', '产业化', '产业基地']
    sent3 = ['辉瑞', '阿里', '互联网', '医师', '培训', '公益', '制药', '项目', '落地', '健康']
    sent4 = ['互联网', '医院', '落地', '阿里', '健康', '就医', '流程', '在线', '支付宝', '加速']
 
    sim1 = model.wv.n_similarity(sent1, sent2)
    sim2 = model.wv.n_similarity(sent1, sent3)
    sim3 = model.wv.n_similarity(sent1, sent4)
 
    print('sim1',sim1)
    print('sim2', sim2)
    print('sim3', sim3)
```

用词移距离来度量的话：

```python
    distance1 = model.wv.wmdistance(sent1,sent2)
    distance2 = model.wv.wmdistance(sent1,sent3)
    distance3 = model.wv.wmdistance(sent1,sent4)
 
    print(distance1)
    print(distance2)
    print(distance3)
```

sim值越大文档的相似性就越高，distances的值越小就越相似。
